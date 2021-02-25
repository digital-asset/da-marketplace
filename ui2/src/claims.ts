import { Claim } from "@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable/module";
import { Observation } from "@daml.js/da-marketplace/lib/ContingentClaims/Observation/module";
import { Id } from "@daml.js/da-marketplace/lib/DA/Finance/Types/module";
import { Date } from "@daml/types";

export const transformObservation = (obs : Observation<Date, boolean>, linkText : string) : any => {
  switch (obs.tag) {
    case "DateEqu":
      const left1 = transformObservation(obs.value._1, "left");
      const right1 = transformObservation(obs.value._2, "right");
      return { ...obs, linkText, type: "Observation", text: "==", collapsedText: `${left1.text} == ${right1.text}`, children: [ left1, right1 ] };
    case "DateIdentity":
      return { ...obs, linkText, type: "Observation", text: "Today", children: null };
    case "DateConst":
      return { ...obs, linkText, type: "Observation", text: obs.value, children: null };
    case "DecimalLte":
      const left2 = transformObservation(obs.value._1, "left");
      const right2 = transformObservation(obs.value._2, "right");
      return { ...obs, linkText, type: "Observation", text: "<=", collapsedText: `${left2.text} == ${right2.text}`, children: [ left2, right2 ] };
    case "DecimalConst":
      return { ...obs, linkText, type: "Observation", text: obs.value, children: null };
    case "DecimalSpot":
      return { ...obs, linkText, type: "Observation", text: `Price(${obs.value})`, children: null };
    default:
      throw new Error("Unknown observation tag: " + obs.tag);
  }
};

export const transformClaim = (claim : Claim<Date, Id>, linkText : string) : any => {
  switch (claim.tag) {
    case "When":
      return { ...claim, linkText, type: "Claim", children: [ transformObservation(claim.value.predicate, "condition"), transformClaim(claim.value.obligation, "then") ] };
    case "Or":
      return { ...claim, linkText, type: "Claim", children: [ transformClaim(claim.value.lhs, "left"), transformClaim(claim.value.rhs, "right") ] };
    case "Cond":
      return { ...claim, linkText, type: "Claim", children: [ transformObservation(claim.value.predicate, "if"), transformClaim(claim.value.success, "then"), transformClaim(claim.value.failure, "else") ] };
    case "Zero":
      return { ...claim, linkText, type: "Claim", children: null };
    case "One":
      return { ...claim, linkText, type: "Claim", text: "1 " + claim.value.label, children: null };
    default:
      throw new Error("Unknown claim tag: " + claim.tag);
  }
};

